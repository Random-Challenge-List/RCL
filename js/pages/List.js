import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list-main">
            <div class="list-container">
                <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    placeholder="Search levels..."
                />
                <table class="list" v-if="filteredList.length">
                    <tr v-for="([level, err], i) in filteredList" :key="level?.id || i">
                        <td class="rank">
                            <p v-if="i + 1 <= 50" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected === i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
                <p v-else>No levels match your search.</p>
            </div>
            <div class="level-container" v-if="level">
                <div class="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0" allowfullscreen></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'Free to Copy' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected + 1 <= 150"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="(record, idx) in level.records" :key="idx" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile" />
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div v-else class="level" style="height: 100%; justify-content: center; align-items: center; display: flex;">
                <p>(ノಠ益ಠ)ノ彡┻━┻</p>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-if="errors.length > 0">
                        <p class="error" v-for="(error, idx) in errors" :key="idx">{{ error }}</p>
                    </div>
                    <div class="og"></div>
                    <template v-if="editors.length">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="(editor, idx) in editors" :key="idx">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role" />
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>Submission Requirements</h3>
                    <p>Achieved the record without using hacks (however, CBF is allowed.)</p>
                    <p>Achieved the record on the level that is listed on the site - please check the level ID before you submit a record</p>
                    <p>Have either source audio or clicks/taps in the video. Edited audio only does not count</p>
                    <p>The recording must have a previous attempt and entire death animation shown before the completion, unless the completion is on the first attempt. Everyplay records are exempt from this</p>
                    <p>The recording must also show the player hit the endwall, or the completion will be invalidated.</p>
                    <p>Do not use secret routes or bug routes</p>
                    <p>Do not use easy modes, only a record of the unmodified level qualifies</p>
                    <p>Once a level falls onto the Legacy List, we accept records for it for 24 hours after it falls off, then afterwards we never accept records for said level</p>
                    <p>If a level has a CBF blocker, you can delete the CBF blocker but you will need to send the ID with the original ID of that level.</p>
                    <p>Levels gameplay must be up to 30 seconds but levels can have ending screens that dont have any gameplay.</p>
                    <p><b>Noclip accuracy is allowed only if you have 0 death and 100% accuracy.</b> But you will have to show your mod menu for at least a second.</p>
                </div>
            </div>
        </main>
    `,
    data() {
        return {
            list: [],
            editors: [],
            loading: true,
            selected: 0,
            errors: [],
            roleIconMap,
            store,
            searchQuery: "",
        };
    },
    computed: {
        level() {
            return this.filteredList[this.selected]?.[0];
        },
        video() {
            if (!this.level?.showcase) {
                return embed(this.level?.verification);
            }
            return embed(this.level.showcase);
        },
        filteredList() {
            if (!this.searchQuery.trim()) return this.list;
            const query = this.searchQuery.trim().toLowerCase();
            return this.list.filter(([level]) => level?.name?.toLowerCase().includes(query));
        },
    },
    async mounted() {
        this.list = await fetchList();
        this.editors = await fetchEditors();

        if (!this.list) {
            this.errors = ["Failed to load list. Retry in a few minutes or notify list staff."];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => `Failed to load level. (${err}.json)`)
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};

<template>
  <main v-if="loading">
    <Spinner />
  </main>
  <main v-else class="page-list">
    <div class="list-container">
      <input
        v-model="search"
        type="text"
        class="search-input"
        placeholder="Search levels..."
      />

      <table class="list" v-if="list">
        <tr
          v-for="([level, err], i) in list"
          v-show="matchesSearch(level)"
          :key="i"
        >
          <td class="rank">
            <p v-if="i + 1 <= 150" class="type-label-lg">#{{ i + 1 }}</p>
            <p v-else class="type-label-lg">Legacy</p>
          </td>
          <td class="level" :class="{ active: selected === i, error: !level }">
            <button @click="selected = i">
              <span class="type-label-lg">{{
                level?.name || `Error (${err}.json)`
              }}</span>
            </button>
          </td>
        </tr>
      </table>
    </div>

    <div class="level-container">
      <div class="level" v-if="level">
        <h1>{{ level.name }}</h1>
        <LevelAuthors
          :author="level.author"
          :creators="level.creators"
          :verifier="level.verifier"
        />
        <iframe
          class="video"
          id="videoframe"
          :src="video"
          frameborder="0"
        ></iframe>
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
            <p>{{ level.password || "Free to Copy" }}</p>
          </li>
        </ul>
        <h2>Records</h2>
        <p v-if="selected + 1 <= 75">
          <strong>{{ level.percentToQualify }}%</strong> or better to qualify
        </p>
        <p v-else-if="selected + 1 <= 150">
          <strong>100%</strong> or better to qualify
        </p>
        <p v-else>This level does not accept new records.</p>
        <table class="records">
          <tr v-for="record in level.records" class="record">
            <td class="percent"><p>{{ record.percent }}%</p></td>
            <td class="user">
              <a
                :href="record.link"
                target="_blank"
                class="type-label-lg"
                >{{ record.user }}</a
              >
            </td>
            <td class="mobile">
              <img
                v-if="record.mobile"
                :src="`/assets/phone-landscape${store.dark ? '-dark' : ''}.svg`"
                alt="Mobile"
              />
            </td>
            <td class="hz"><p>{{ record.hz }}Hz</p></td>
          </tr>
        </table>
      </div>
      <div
        v-else
        class="level"
        style="height: 100%; justify-content: center; align-items: center;"
      >
        <p>(ノಠ益ಠ)ノ彡┻━┻</p>
      </div>
    </div>

    <!-- meta-container and editors stay unchanged -->
    <!-- ... -->
  </main>
</template>

<script>
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
  data: () => ({
    list: [],
    editors: [],
    loading: true,
    selected: 0,
    errors: [],
    store,
    search: "",
    roleIconMap,
  }),
  computed: {
    level() {
      return this.list[this.selected]?.[0];
    },
    video() {
      if (!this.level) return "";
      if (!this.level.showcase) return embed(this.level.verification);
      return embed(
        this.toggledShowcase
          ? this.level.showcase
          : this.level.verification
      );
    },
  },
  async mounted() {
    this.list = await fetchList();
    this.editors = await fetchEditors();
    this.loading = false;
  },
  methods: {
    embed,
    score,
    matchesSearch(level) {
      if (!level) return false;
      return level.name.toLowerCase().includes(this.search.toLowerCase());
    },
  },
};
</script>

<style>
.search-input {
  margin: 12px;
  padding: 8px;
  width: 100%;
  max-width: 400px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #666;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}
</style>

export default {
  name: 'Submit',
  data() {
    return {
      mode: 'verification',
      player: '',
      creatorName: '',
      levelId: '',
      video: '',
      rawVideo: '',
      levels: [],
      selectedLevelId: '',
      status: '',
    };
  },
  watch: {
    selectedLevelId(newId) {
      const lvl = this.levels.find(l => l.id === newId);
      if (lvl) {
        this.levelId = lvl.id;
        this.creatorName = lvl.creatorName || '';
      } else {
        this.levelId = '';
        this.creatorName = '';
      }
    }
  },
  async mounted() {
    try {
      const res = await fetch('/data/_list.json');
      this.levels = await res.json();
    } catch (e) {
      console.error('Failed to load levels list:', e);
      this.levels = [];
    }
  },
  methods: {
    async sendData() {
      let data = { type: this.mode };
      if (this.mode === 'verification') {
        data.player = this.player;
        data.creatorName = this.creatorName;
        data.levelId = this.levelId;
        data.video = this.video;
        data.rawVideo = this.rawVideo;
      } else {
        data.player = this.player;
        data.levelId = this.selectedLevelId;
        data.video = this.video;
        data.rawVideo = this.rawVideo;
      }
      try {
        const res = await fetch('https://rclwebhook.nixkwasthere.workers.dev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        this.status = res.ok ? '✅ Submitted successfully!' : '❌ Submission failed!';
      } catch (e) {
        this.status = '❌ Submission failed (network error)!';
      }
    }
  },
  template: `
    <div class="page-list">
      <h1>Submit Record</h1>
      <label>
        Mode:
        <select v-model="mode" style="margin-left: 0.5rem;">
          <option value="verification">Verification</option>
          <option value="submission">Submission</option>
        </select>
      </label>

      <form @submit.prevent="sendData" style="margin-top: 1rem;">
        <div v-if="mode === 'verification'">
          <label>
            Player Name:
            <input v-model="player" required />
          </label><br/>

          <label>
            Creator Name:
            <input v-model="creatorName" required />
          </label><br/>

          <label>
            Level ID:
            <input v-model="levelId" required />
          </label><br/>

          <label>
            Video Link:
            <input v-model="video" type="url" required />
          </label><br/>

          <label>
            Raw Video Link:
            <input v-model="rawVideo" type="url" required />
          </label>
        </div>

        <div v-else>
          <label>
            Player Name:
            <input v-model="player" required />
          </label><br/>

          <label>
            Select Level:
            <select v-model="selectedLevelId" required>
              <option disabled value="">-- Select a Level --</option>
              <option v-for="lvl in levels" :key="lvl.id" :value="lvl.id">
                {{ lvl.name }}
              </option>
            </select>
          </label><br/>

          <label>
            Video Link:
            <input v-model="video" type="url" required />
          </label><br/>

          <label>
            Raw Video Link:
            <input v-model="rawVideo" type="url" required />
          </label>
        </div>

        <button type="submit" style="margin-top: 1rem;">Submit</button>
      </form>

      <p style="margin-top: 1rem;">{{ status }}</p>
    </div>
  `
};

export default {
  name: 'Submit',
  data() {
    return {
      mode: 'verification',
      player: '',
      creatorName: '',
      levels: [],
      selectedLevelId: '',
      video: '',
      rawVideo: '',
      status: '',
    };
  },
  async mounted() {
    try {
      const res = await fetch('/data/_list.json');
      this.levels = await res.json();
      if (this.levels.length) {
        this.selectedLevelId = this.levels[0].id || '';
      }
      console.log("Loaded levels:", this.levels);
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
        data.levelId = this.selectedLevelId;
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
        console.error('Submission error:', e);
        this.status = '❌ Submission failed (network error)!';
      }
    }
  },
  template: `
    <div class="page-submit">
      <h1>Submit Record</h1>

      <label>
        Mode:
        <select v-model="mode" style="margin-left: 0.5rem;">
          <option value="verification">Verification</option>
          <option value="submission">Submission</option>
        </select>
      </label>

      <form @submit.prevent="sendData" style="margin-top: 1rem; text-align: left;">
        <label>
          Player Name:
          <input v-model="player" required />
        </label>

        <label v-if="mode === 'verification'">
          Creator Name:
          <input v-model="creatorName" required />
        </label>

        <label>
          Level:
          <select v-model="selectedLevelId" required>
            <option disabled value="">-- select level --</option>
            <option v-for="level in levels" :key="level.id" :value="level.id">
              {{ level.name }}
            </option>
          </select>
        </label>

        <label>
          Video Link:
          <input v-model="video" type="url" required />
        </label>

        <label>
          Raw Video Link:
          <input v-model="rawVideo" type="url" required />
        </label>

        <button type="submit">Submit</button>
      </form>

      <p style="margin-top: 1rem; text-align: center;">{{ status }}</p>
    </div>
  `
};

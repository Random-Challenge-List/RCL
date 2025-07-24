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
      cbf: false,
      status: '',
    };
  },
  methods: {
    async sendData() {
      let data = {
        type: this.mode,
        player: this.player,
        levelId: this.levelId,
        video: this.video,
        cbf: this.cbf,
      };

      if (this.mode === 'verification') {
        data.creatorName = this.creatorName;
      }

      if (this.rawVideo.trim()) {
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
          {{ mode === 'submission' ? 'Level Name' : 'Level ID' }}:
          <input v-model="levelId" required />
        </label>

        <label>
          Video Link:
          <input v-model="video" type="url" required />
        </label>

        <label>
          Raw Video Link:
          <input v-model="rawVideo" type="url" placeholder="Optional" />
        </label>

        <label style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
          <input type="checkbox" v-model="cbf" />
          CBF
        </label>

        <button type="submit">Submit</button>
      </form>

      <p style="margin-top: 1rem; text-align: center;">{{ status }}</p>
    </div>
  `
};

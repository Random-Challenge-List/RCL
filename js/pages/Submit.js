export default {
  name: 'Submit',
  data() {
    return {
      mode: 'verification',
      player: '',
      level: '',
      video: '',
      rulesConfirmed: false,
      levelName: '',
      difficulty: '',
      creatorId: '',
      description: '',
      status: ''
    };
  },
  methods: {
    async sendData() {
      const data = { type: this.mode };
      if (this.mode === 'verification') {
        data.player = this.player;
        data.level = this.level;
        data.video = this.video;
        data.rulesConfirmed = this.rulesConfirmed;
      } else {
        data.levelName = this.levelName;
        data.difficulty = this.difficulty;
        data.creatorId = this.creatorId;
        data.description = this.description;
      }

      try {
        const res = await fetch("https://rclwebhook.nixkwasthere.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        this.status = res.ok ? "✅ Submitted successfully!" : "❌ Submission failed!";
      } catch (e) {
        this.status = "❌ Submission failed (network error)!";
      }
    }
  },
  template: `
    <div>
      <h1>Submit Record</h1>
      <label>Mode:
        <select v-model="mode">
          <option value="verification">Verification</option>
          <option value="submission">Submission</option>
        </select>
      </label>

      <form @submit.prevent="sendData" style="margin-top: 1rem;">
        <div v-if="mode === 'verification'">
          <label>Player Name: <input v-model="player" required /></label><br/>
          <label>Level Name: <input v-model="level" required /></label><br/>
          <label>Video Link: <input v-model="video" type="url" required /></label><br/>
          <label><input type="checkbox" v-model="rulesConfirmed" required /> I confirm all rules are followed</label>
        </div>

        <div v-else>
          <label>Level Name: <input v-model="levelName" required /></label><br/>
          <label>Difficulty: <input v-model="difficulty" required /></label><br/>
          <label>Creator ID: <input v-model="creatorId" required /></label><br/>
          <label>Description: <textarea v-model="description" required></textarea></label>
        </div>

        <button type="submit" style="margin-top: 1rem;">Submit</button>
      </form>

      <p style="margin-top: 1rem;">{{ status }}</p>
    </div>
  `
};

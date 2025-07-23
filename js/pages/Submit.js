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

      <form @submit.prevent="sendData" style="margin-top

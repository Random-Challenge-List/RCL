<template>
  <div class="submit-page">
    <h1>Submit Form</h1>

    <label for="mode">Select Mode:</label>
    <select v-model="mode" @change="updateForm">
      <option value="verification">Verification</option>
      <option value="submission">Submission</option>
    </select>

    <form @submit.prevent="submit">
      <div v-if="mode === 'verification'">
        <label>Player Name: <input v-model="form.player" required /></label>
        <label>Level Name: <input v-model="form.level" required /></label>
        <label>Video Link: <input v-model="form.video" required /></label>
        <label>
          <input type="checkbox" v-model="form.rulesConfirmed" required />
          I confirm all rules are followed
        </label>
      </div>

      <div v-if="mode === 'submission'">
        <label>Level Name: <input v-model="form.levelName" required /></label>
        <label>Difficulty: <input v-model="form.difficulty" required /></label>
        <label>Creator ID: <input v-model="form.creatorId" required /></label>
        <label>Description: <textarea v-model="form.description" required></textarea></label>
      </div>

      <button type="submit">Submit</button>
      <p v-if="status" :style="{ color: statusColor }">{{ status }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Submit',
  data() {
    return {
      mode: 'verification',
      form: {
        player: '',
        level: '',
        video: '',
        rulesConfirmed: false,
        levelName: '',
        difficulty: '',
        creatorId: '',
        description: '',
      },
      status: '',
      statusColor: 'black',
    };
  },
  methods: {
    updateForm() {
      this.status = '';
    },
    async submit() {
      const payload = {
        type: this.mode,
        ...(this.mode === 'verification'
          ? {
              player: this.form.player,
              level: this.form.level,
              video: this.form.video,
              rulesConfirmed: this.form.rulesConfirmed,
            }
          : {
              levelName: this.form.levelName,
              difficulty: this.form.difficulty,
              creatorId: this.form.creatorId,
              description: this.form.description,
            }),
      };

      try {
        const res = await fetch('https://rclwebhook.nixkwasthere.workers.dev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Server error');
        this.status = 'Submitted successfully!';
        this.statusColor = 'green';
      } catch (err) {
        this.status = 'Submission failed!';
        this.statusColor = 'red';
      }
    },
  },
};
</script>

<style scoped>
.submit-page {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
label {
  display: block;
  margin-top: 10px;
}
input, textarea, select, button {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
}
button {
  margin-top: 20px;
}
</style>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Submit Form</title>
  <style>
    body { font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; }
    .hidden { display: none; }
    label { display: block; margin-top: 10px; }
  </style>
</head>
<body>
  <h2>Mode:</h2>
  <select id="mode" onchange="updateForm()">
    <option value="verification">Verification</option>
    <option value="submission">Submission</option>
  </select>

  <form id="form" onsubmit="sendData(event)">
    <div id="verificationFields">
      <label>Player Name: <input type="text" id="player" required></label>
      <label>Level Name: <input type="text" id="level" required></label>
      <label>Video Link: <input type="url" id="video" required></label>
      <label><input type="checkbox" id="rulesConfirmed" required> I confirm all rules are followed</label>
    </div>

    <div id="submissionFields" class="hidden">
      <label>Level Name: <input type="text" id="levelName" required></label>
      <label>Difficulty: <input type="text" id="difficulty" required></label>
      <label>Creator ID: <input type="text" id="creatorId" required></label>
      <label>Description: <textarea id="description" required></textarea></label>
    </div>

    <button type="submit">Submit</button>
  </form>

  <p id="status"></p>

  <script>
    function updateForm() {
      const mode = document.getElementById("mode").value;
      document.getElementById("verificationFields").classList.toggle("hidden", mode !== "verification");
      document.getElementById("submissionFields").classList.toggle("hidden", mode !== "submission");
    }

    async function sendData(e) {
      e.preventDefault();
      const mode = document.getElementById("mode").value;
      let data = { type: mode };

      if (mode === "verification") {
        data.player = document.getElementById("player").value;
        data.level = document.getElementById("level").value;
        data.video = document.getElementById("video").value;
        data.rulesConfirmed = document.getElementById("rulesConfirmed").checked;
      } else {
        data.levelName = document.getElementById("levelName").value;
        data.difficulty = document.getElementById("difficulty").value;
        data.creatorId = document.getElementById("creatorId").value;
        data.description = document.getElementById("description").value;
      }

      const res = await fetch("https://rclwebhook.nixkwasthere.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      document.getElementById("status").textContent = res.ok ? "Submitted successfully!" : "Submission failed!";
    }
  </script>
</body>
</html>

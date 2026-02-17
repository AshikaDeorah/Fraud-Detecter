let alertSound = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");

document.getElementById("emailContent").addEventListener("input", function() {
    let content = this.value.toLowerCase();
    let previewRisk = 0;
    const previewWords = ["urgent","password","verify","otp","login","bank"];

    previewWords.forEach(word => {
        if (content.includes(word)) previewRisk += 5;
    });

    document.getElementById("riskScore").innerText = previewRisk + "% (Live)";
});

function analyzeContent() {

    document.getElementById("loading").style.display = "block";

    setTimeout(() => {

        let email = document.getElementById("emailContent").value.toLowerCase();
        let url = document.getElementById("urlInput").value.toLowerCase();
        let fileInput = document.getElementById("fileInput").files[0];

        let risk = 0;
        let reasons = [];

        const suspiciousWords = [
            "urgent","password","verify","click here",
            "bank","otp","login","suspended",
            "credentials","unusual activity","act now"
        ];

        suspiciousWords.forEach(word => {
            if (email.includes(word)) {
                risk += 8;
                reasons.push("Keyword detected: " + word);
            }
        });

        if (url.includes("http://")) {
            risk += 15;
            reasons.push("Unsecured HTTP link");
        }

        if (url.includes("@") || url.includes("verify") || url.includes("-secure")) {
            risk += 20;
            reasons.push("Possible spoofed domain");
        }

        const fakeBrands = ["paypa1","g00gle","amaz0n","micros0ft"];
        fakeBrands.forEach(brand => {
            if (url.includes(brand)) {
                risk += 25;
                reasons.push("Brand spoofing detected: " + brand);
            }
        });

        if (fileInput) {
            let fileName = fileInput.name.toLowerCase();
            if (fileName.endsWith(".exe") || fileName.endsWith(".zip") || fileName.endsWith(".scr")) {
                risk += 25;
                reasons.push("Executable attachment detected");
            }
        }

        if (risk > 100) risk = 100;

        let aiConfidence = Math.min(95, risk + Math.floor(Math.random() * 10));

        document.getElementById("riskScore").innerText = risk + "%";
        document.getElementById("riskLevel").innerText =
            "Threat Level: " + (risk > 70 ? "High Risk" :
                                risk > 40 ? "Medium Risk" :
                                risk > 10 ? "Low Risk" : "Safe");

        document.getElementById("aiConfidence").innerText =
            "AI Confidence Score: " + aiConfidence + "%";

        document.getElementById("explanation").innerText =
            reasons.length ? reasons.join(" | ") : "No major threats detected.";

        document.getElementById("riskBreakdown").innerHTML =
            "<p><b>Risk Breakdown:</b></p>" +
            "<p>Email Scan: " + (email ? "✔ Checked" : "✖ Empty") + "</p>" +
            "<p>URL Scan: " + (url ? "✔ Checked" : "✖ Not Provided") + "</p>" +
            "<p>Attachment Scan: " + (fileInput ? "✔ Scanned" : "✖ None") + "</p>";

        document.getElementById("gauge").style.background =
            "conic-gradient(#00f7ff " + (risk * 3.6) + "deg, #222 0deg)";

        if (risk > 70) alertSound.play();

        document.getElementById("loading").style.display = "none";

    }, 1200);
}

function clearAll() {
    document.getElementById("emailContent").value = "";
    document.getElementById("urlInput").value = "";
    document.getElementById("fileInput").value = "";
    document.getElementById("riskScore").innerText = "0%";
    document.getElementById("riskLevel").innerText = "Threat Level: Safe";
    document.getElementById("aiConfidence").innerText = "AI Confidence Score: 0%";
    document.getElementById("explanation").innerText = "Analysis result will appear here.";
    document.getElementById("riskBreakdown").innerHTML = "";
    document.getElementById("gauge").style.background =
        "conic-gradient(#00f7ff 0deg, #222 0deg)";
}

function exportReport() {
    let report =
        "AI Fraud Detection Report\n\n" +
        "Risk Score: " + document.getElementById("riskScore").innerText + "\n" +
        document.getElementById("riskLevel").innerText + "\n" +
        document.getElementById("aiConfidence").innerText + "\n\n" +
        "Explanation:\n" +
        document.getElementById("explanation").innerText;

    let blob = new Blob([report], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Fraud_Report.txt";
    link.click();
}

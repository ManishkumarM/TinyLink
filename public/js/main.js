// public/js/main.js

// Add New Link
async function createLink(event) {
    event.preventDefault();

    const original_url = document.getElementById("original_url").value;
    const short_code = document.getElementById("short_code").value;

    const statusBox = document.getElementById("status-box");
    statusBox.innerHTML = "Creating...";
    statusBox.className = "alert alert-info";

    try {
        const res = await fetch("http://localhost:5000/api/links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ original_url, short_code })
        });

        const data = await res.json();

        if (!res.ok) {
            statusBox.innerHTML = data.error || "Something went wrong";
            statusBox.className = "alert alert-danger";
            return;
        }

        statusBox.innerHTML = "Link created successfully!";
        statusBox.className = "alert alert-success";

        // reload after small delay
        setTimeout(() => window.location.reload(), 800);

    } catch (err) {
        statusBox.innerHTML = "Server error";
        statusBox.className = "alert alert-danger";
    }
}

// Delete link
async function deleteLink(code) {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
        const res = await fetch(`/api/links/${code}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            alert("Error deleting link.");
            return;
        }

        window.location.reload();

    } catch {
        alert("Server error");
    }
}


function copyShortURL() {
    const input = document.getElementById("shortURL");
    navigator.clipboard.writeText(input.value)
        .then(() => alert("Copied to clipboard!"))
        .catch(() => alert("Copy failed"));
}


function filterLinks() {
    const input = document.getElementById("searchBox").value.toLowerCase();
    const rows = document.querySelectorAll("table tbody tr");

    rows.forEach(row => {
        const code = row.children[0].innerText.toLowerCase();
        const url = row.children[1].innerText.toLowerCase();

        if (code.includes(input) || url.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

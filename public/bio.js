function updateBio(){
    let bio = document.getElementById("bioContent");
    let textArea = document.getElementById("bio-text-area");
    textArea.value = bio.textContent.replace(/\s+/g, ' ').trim();
}
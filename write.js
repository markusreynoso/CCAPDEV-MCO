function clearTextAreas(elementIdList) {
    for (let i = 0; i < elementIdList.length; i++){
        let elementId = elementIdList[i];
        document.getElementById(elementId).value = '';
    }
}
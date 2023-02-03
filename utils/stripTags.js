export default (text) => {
    return text
        .replace(/<[^>]*>/g, "")
        .replace(/\n\n/g, "\n")
        .replace(/\n/g, " ")
}

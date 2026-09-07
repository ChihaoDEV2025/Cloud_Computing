class Utils {
  constructor() {}
  formatDay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-en", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}

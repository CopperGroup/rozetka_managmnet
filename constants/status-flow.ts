export const statusFlow = [
    "Запитали за товар",
    "Дякую",
    "Запропонували",
    "Хочуть подивитися",
    "Надіслали сайт",
    "Взяли/Дали контакт",
    "Zoom",
    "В процесі",
    "Клієнт",
    "Відмовили",
    "Не хочуть подивитися",
  ]
  
  export const getNextStatuses = (currentStatus: string) => {
    switch (currentStatus) {
      case "Запитали за товар":
        return ["Дякую"]
      case "Дякую":
        return ["Запропонували"]
      case "Запропонували":
        return ["Хочуть подивитися", "Не хочуть подивитися"]
      case "Хочуть подивитися":
        return ["Надіслали сайт"]
      case "Надіслали сайт":
        return ["Взяли/Дали контакт", "Відмовили"]
      case "Взяли/Дали контакт":
        return ["Zoom"]
      case "Zoom":
        return ["В процесі"]
      case "В процесі":
        return ["Клієнт"]
      default:
        return []
    }
  }
  
  export const getPreviousStatus = (currentStatus: string) => {
    const currentIndex = statusFlow.indexOf(currentStatus)
    if (currentIndex <= 0) return null
    if (currentStatus === "Відмовили" || currentStatus === "Не хочуть подивитися") {
      return "Запропонували"
    }
    return statusFlow[currentIndex - 1]
  }
  
  
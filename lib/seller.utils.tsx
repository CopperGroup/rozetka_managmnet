import { CheckCircle2, XCircle } from "lucide-react"
import { getNextStatuses, getPreviousStatus, statusFlow } from "@/constants/status-flow"

export const getAvailableStatuses = (currentStatus: string) => {
  const previousStatus = getPreviousStatus(currentStatus)
  const nextStatuses = getNextStatuses(currentStatus)

  let availableStatuses = [currentStatus]

  if (previousStatus) {
    availableStatuses.unshift(previousStatus)
  }

  if (nextStatuses.length > 0) {
    availableStatuses = availableStatuses.concat(nextStatuses)
  }

  return availableStatuses
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Клієнт":
      return "text-green-600"
    case "Відмовили":
    case "Не хочуть подивитися":
      return "text-red-600"
    case "В процесі":
    case "Zoom":
    case "Взяли/Дали контакт":
      return "text-blue-600"
    default:
      return "text-gray-600 dark:text-gray-300"
  }
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Клієнт":
      return <CheckCircle2 className="inline-block mr-2" size={16} />
    case "Відмовили":
    case "Не хочуть подивитися":
      return <XCircle className="inline-block mr-2" size={16} />
    default:
      return null
  }
}

export const getDayTime = () => {
  const kyivTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Kiev" });
  const hours = new Date(kyivTime).getHours();


  if (hours >= 5 && hours < 12) {
    return "ранку" // morning
  } else if (hours >= 12 && hours < 18) {
    return "дня" // afternoon
  } else {
    return "вечора" // evening
  }
}

export const getClipboardText = (status: string, nicheName = "") => {
  const dayTime = getDayTime() // Get the current time of day
  const nicheText = nicheName ? ` ${nicheName}` : ""

  switch (status) {
    case "Запитали за товар":
      return `Доброго ${dayTime}!) У вас є веб-сторінка де можна весь каталог${nicheText} глянути?)`
    case "Дякую":
      return `Дякую!)`
    case "Запропонували":
      return `Доброго ${dayTime}, я тут посидів трохи вчора і зробив вам власний інтернет магазин. Якщо хочете глянути, то можу кинути лінк. Переніс деякі ваші товари)`
    case "Надіслали сайт":
      return `Доброго ${dayTime}, даруйте, що так пізно, були пари. Ось покликання, воно частинами, адже Розетка блокує, якщо кидати повним`
    default:
      return null
  }
}

export const isStatusMoreThan = (currentStatus: string, compareStatus: string) => {
  return statusFlow.indexOf(currentStatus) > statusFlow.indexOf(compareStatus) && currentStatus !== "Не хочуть подивитися"
}


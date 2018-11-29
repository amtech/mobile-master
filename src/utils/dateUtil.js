export default function dateToObjUtil(param) {
  if (typeof param !== 'number') {
    return false
  }
  const timeObj = new Date(param)
  const year = timeObj.getFullYear()
  const month = timeObj.getMonth() + 1 > 9 ? timeObj.getMonth() + 1 : `0${timeObj.getMonth()}`
  const day = timeObj.getDate() > 9 ? timeObj.getDate() : `0${timeObj.getDate()}`
  const hours = timeObj.getHours() > 9 ? timeObj.getHours() : `0${timeObj.getHours()}`
  const mins = timeObj.getMinutes() > 9 ? timeObj.getMinutes() : `0${timeObj.getMinutes()}`
  const seconds = timeObj.getSeconds() > 9 ? timeObj.getSeconds() : `0${timeObj.getSeconds()}`

  return {
    year: year,
    month: month,
    day: day,
    hours: hours,
    mins: mins,
    seconds: seconds
  }
}
const getStatusLabel = (label: number) => {
  switch (label) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 3
    default:
      return 4
  }
}

const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 0:
      return "⏳ LOW"
    case 1:
      return "🏃‍♂️ Medium"
    case 2:
      return "☢️ High"
    case 3:
      return "💀 EXTREME"
    default:
      break
  }
}

const getPriorityBadge = (priority: number) => {
  switch (priority) {
    case 0:
      return "chill-blue"
    case 1:
      return "chill-green"
    case 2:
      return "warning"
    case 3:
      return "danger"
    default:
      break
  }
}


const priorities = {
  "Low": 0,
  "Medium": 1,
  "High": 2,
  "Extreme": 3,
}

export { getStatusLabel, getPriorityLabel, getPriorityBadge, priorities };

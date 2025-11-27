"use client"

/**
 * Creates an onboarding task for first-time users
 * Task includes a checklist with 5 items to guide users through the platform
 */
export function createOnboardingTask() {
  if (typeof window === "undefined") return

  // Дані для сабтасок (використовується для створення та оновлення)
  const subtaskIds = ["subtask-1", "subtask-2", "subtask-3", "subtask-4", "subtask-5", "subtask-6"]
  
  // Визначення сабтасок (використовується для створення та оновлення)
  const subtaskDefinitions = [
    {
      id: "subtask-1",
      name: "Review your homepage — this is where your assigned items appear",
      description: "Your Home page is your daily workspace.\n\nHere you'll see everything that needs your attention — tasks, decisions, updates.\n\nIt's the easiest place to stay on top of what matters.",
      whatYouLearn: "How to navigate your personal dashboard and quickly find what's waiting for you.",
      targetUrl: "/",
      showHowSteps: [
        "Click Home in the left menu",
        "Look at your assigned tasks and decisions",
        "Notice how everything is grouped by status"
      ],
    },
    {
      id: "subtask-2",
      name: "Explore the left menu — see Decisions, Projects, and more",
      description: "The left menu is your map of the platform.\n\nEach section helps you manage a different part of your work — from approvals to projects.",
      whatYouLearn: "You'll understand what each main area is for and how to move between them.",
      targetElementId: "navigation",
      showHowSteps: [
        "Look at the left sidebar",
        "Click Decisions — see how approvals work",
        "Click Projects — see project tracking",
        "Click Tasks — your full task list"
      ],
    },
    {
      id: "subtask-3",
      name: "Leave a comment on this task (you can @mention teammates)",
      description: "Comments help you collaborate.\n\nThis is where you can ask questions, share updates, or tag someone for input.",
      whatYouLearn: "How to write comments and use @mentions to loop people in.",
      targetElementId: "comment-input",
      scrollToSection: "comments",
      showHowSteps: [
        "Scroll to the Comments section",
        "Type a short message",
        "Try using @ + name to mention someone",
        "Click Send"
      ],
    },
    {
      id: "subtask-4",
      name: "Try updating this task's status",
      description: "Status shows where your work stands — from \"To Do\" to \"In Progress\" to \"Done\".\n\nUpdating it helps everyone stay in sync.",
      whatYouLearn: "How to move tasks through their lifecycle.",
      targetElementId: "task-status",
      scrollToSection: "details",
      showHowSteps: [
        "Go to the Details section",
        "Open the Status dropdown",
        "Choose a new status (e.g., \"In Progress\")",
        "Watch the badge update instantly"
      ],
    },
    {
      id: "subtask-5",
      name: "Explore a module that interests you",
      description: "Each module in Way2B1 unlocks a part of how your organization works — approvals, projects, finances, tasks, and more.\n\nTake a moment to open one and look around.",
      whatYouLearn: "You'll get a feel for what's available and which tools you'll use most.",
      targetElementId: "navigation",
      showHowSteps: [
        "Click any module in the left menu",
        "Look around the interface",
        "If there's a New button, try creating a test item",
        "Return to Tasks when you're done"
      ],
    },
    {
      id: "subtask-6",
      name: "Mark this task complete when you're ready",
      description: "Once you're done exploring and feel comfortable, mark this task as complete.\n\nThis means you're ready to start using Way2B1 in your day-to-day work.",
      whatYouLearn: "How to complete tasks and keep your list organized.",
      targetElementId: "task-status",
      scrollToSection: "details",
      showHowSteps: [
        "Go to the Details section",
        "Open the Status dropdown",
        "Select Done",
        "Enjoy the celebration when all onboarding tasks are complete 🎉"
      ],
    },
  ]

  // Створюємо об'єкт для швидкого доступу до даних сабтасок
  const subtaskData: Record<string, any> = {
    "subtask-1": subtaskDefinitions[0],
    "subtask-2": subtaskDefinitions[1],
    "subtask-3": subtaskDefinitions[2],
    "subtask-4": subtaskDefinitions[3],
    "subtask-5": subtaskDefinitions[4],
    "subtask-6": subtaskDefinitions[5],
  }

  // Check if onboarding task already exists
  const existingTasks = JSON.parse(localStorage.getItem("way2b1_tasks") || "[]")
  const existingOnboardingTask = existingTasks.find(
    (task: any) => task.name === "Welcome to NextGen — Your Quick Start Guide"
  )

  if (existingOnboardingTask) {
    // Отримуємо baseTaskId з основної таски
    const baseTaskId = existingOnboardingTask.taskId || `ONBOARD-${Date.now().toString().slice(-4)}`
    
    // Оновлюємо існуючі сабтаски, якщо вони не мають нових полів
    let updated = false
    const updatedTasks = existingTasks.map((task: any) => {
      if (subtaskIds.includes(task.id)) {
        const data = subtaskData[task.id]
        if (data) {
          // Отримуємо повне визначення сабтаски
          const subtaskDef = subtaskDefinitions.find((def: any) => def.id === task.id)
          if (subtaskDef) {
            // Отримуємо індекс сабтаски для формування taskId
            const subtaskIndex = subtaskDefinitions.findIndex((def: any) => def.id === task.id)
            const newTaskId = `${baseTaskId}-${String(subtaskIndex + 1).padStart(2, '0')}`
            
            // Отримуємо assignee з існуючої таски або з localStorage
            const firstName = localStorage.getItem("way2b1_user_first_name") || ""
            const lastName = localStorage.getItem("way2b1_user_last_name") || ""
            const userEmail = localStorage.getItem("way2b1_user_email") || ""
            const currentAssignee = task.assignee || (firstName && lastName ? `${firstName} ${lastName}` : userEmail || "Current User")
            
            // Оновлюємо, якщо немає description, whatYouLearn, category, назва змінилася або taskId має старий формат
            const needsUpdate = !task.description || !task.whatYouLearn || 
              task.name !== subtaskDef.name || task.category !== "Onboarding" ||
              task.taskId === task.id || !task.taskId || !task.taskId.startsWith(baseTaskId)
            
            if (needsUpdate) {
              updated = true
              return { 
                ...task, 
                description: subtaskDef.description,
                whatYouLearn: subtaskDef.whatYouLearn,
                targetUrl: subtaskDef.targetUrl,
                targetElementId: subtaskDef.targetElementId,
                scrollToSection: subtaskDef.scrollToSection,
                showHowSteps: subtaskDef.showHowSteps,
                name: subtaskDef.name,
                title: subtaskDef.name,
                taskId: newTaskId, // Оновлюємо taskId на правильний формат
                assignee: currentAssignee, // Оновлюємо assignee
                reporter: task.reporter || currentAssignee, // Оновлюємо reporter якщо немає
                category: "Onboarding", // Встановлюємо category = "Onboarding"
                project: task.project || "Onboarding" // Зберігаємо project або встановлюємо "Onboarding"
              }
            }
          }
        }
      }
      return task
    })

    if (updated) {
      localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))
      window.dispatchEvent(new CustomEvent("taskUpdated"))
    }

    return existingOnboardingTask // Повертаємо існуючу таску
  }

  // Get current user info
  const firstName = localStorage.getItem("way2b1_user_first_name") || ""
  const lastName = localStorage.getItem("way2b1_user_last_name") || ""
  const userEmail = localStorage.getItem("way2b1_user_email") || ""
  const assignee = firstName && lastName ? `${firstName} ${lastName}` : userEmail || "Current User"

  // Create onboarding task
  const onboardingTaskId = `onboarding-${Date.now()}`
  const baseTaskId = `ONBOARD-${Date.now().toString().slice(-4)}`
  const onboardingTask = {
    id: onboardingTaskId,
    taskId: baseTaskId,
    name: "Welcome to NextGen — Your Quick Start Guide",
    priority: "Normal",
    status: "To Do",
    assignee: assignee,
    dueDate: "—",
    reporter: assignee,
    category: "Onboarding",
    project: "Onboarding",
    amount: "—",
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  }

  // Створюємо сабтаски з додатковими полями для збереження
  const subtaskTasks = subtaskDefinitions.map((st, index) => ({
    id: st.id,
    taskId: `${baseTaskId}-${String(index + 1).padStart(2, '0')}`,
    name: st.name,
    title: st.name,
    description: st.description,
    whatYouLearn: st.whatYouLearn,
    status: "To Do",
    priority: "Normal",
    parentTaskId: onboardingTaskId,
    assignee: assignee, // Додаємо assignee для всіх сабтасок
    reporter: assignee, // Додаємо reporter для всіх сабтасок
    category: "Onboarding",
    project: "Onboarding",
    targetUrl: st.targetUrl,
    targetElementId: st.targetElementId,
    scrollToSection: st.scrollToSection,
    showHowSteps: st.showHowSteps,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  }))


  // Add onboarding task and all subtask tasks
  const updatedTasks = [...existingTasks, onboardingTask, ...subtaskTasks]
  localStorage.setItem("way2b1_tasks", JSON.stringify(updatedTasks))

  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent("taskUpdated"))
  
  return onboardingTask
}


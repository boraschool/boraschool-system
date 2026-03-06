export async function getSchools() {
  const res = await fetch('/api/schools')
  
  if (!res.ok) {
    throw new Error('Failed to fetch schools')
  }

  return res.json()
}

export async function addStudent(student: any) {
  const res = await fetch('/api/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(student)
  })

  if (!res.ok) {
    throw new Error('Failed to add student')
  }

  return res.json()
}
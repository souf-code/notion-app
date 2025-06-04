// app/page.tsx
export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">📁 My Projects</h1>
      <ul className="space-y-2">
        <li className="bg-gray-100 p-4 rounded-lg shadow">Project 1</li>
        <li className="bg-gray-100 p-4 rounded-lg shadow">Project 2</li>
        <li className="bg-gray-100 p-4 rounded-lg shadow">Project 3</li>
      </ul>
    </main>
  );
}

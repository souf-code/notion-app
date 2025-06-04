export const dynamic = 'force-dynamic';
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: projects, error } = await supabase
   .from("project_hub")

    .select("*");

  if (error) {
    return <p className="text-red-500 p-4">Error: {error.message}</p>;
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">📁 My Projects</h1>
      <ul className="space-y-2">
        {projects?.map((project: any) => (
          project.name && (
            <li key={project.id} className="bg-gray-100 p-4 rounded-lg shadow">
              {project.name}
            </li>
          )
        ))}
      </ul>
    </main>
  );
}

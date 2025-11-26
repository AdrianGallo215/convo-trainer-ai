import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Faltan variables de entorno. Define SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function seed() {
  const psychologists = [
    { email: 'psicologo@gmail.com', password: 'Psicologo_123', full_name: 'Dr. Psicólogo Principal', username: 'psicologo.principal' },
  ];

  for (const p of psychologists) {
    console.log('Creando usuario:', p.email);

    // Crear usuario en Auth (requiere service role key)
    const { data, error: createError } = await supabase.auth.admin.createUser({
      email: p.email,
      password: p.password,
      email_confirm: true,
      user_metadata: { full_name: p.full_name, username: p.username }
    });

    if (createError) {
      console.error('Error creando usuario:', createError.message || createError);
      continue;
    }

    const user = (data && (data.user || data)) || null;
    const userId = user?.id;
    if (!userId) {
      console.error('No se pudo obtener el id del usuario creado para', p.email);
      continue;
    }

    console.log('Usuario creado con id:', userId);

    // Insertar perfil (opcional, muchas apps usan triggers para crear profile automáticamente)
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      full_name: p.full_name,
      username: p.username,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      xp: 0,
      level: 1,
      streak_days: 0,
      total_sessions: 0,
      last_practice_date: null
    });

    if (profileError) {
      console.error('Error insertando profile para', p.email, profileError.message || profileError);
    } else {
      console.log('Profile creado para', p.email);
    }

    // Insertar rol de psychologist
    const { error: roleError } = await supabase.from('user_roles').insert({
      user_id: userId,
      role: 'psychologist'
    });

    if (roleError) {
      console.error('Error insertando user_roles para', p.email, roleError.message || roleError);
    } else {
      console.log('Rol psychologist asignado a', p.email);
    }
  }

  console.log('Seeding finalizado. Revisa la consola para errores.');
}

seed().catch((err) => {
  console.error('Seed error', err);
  process.exit(1);
});

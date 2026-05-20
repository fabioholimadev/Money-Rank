-- Supabase RPC function to safely complete a task and update streak/coins
-- Deploy this in your Supabase SQL editor or migration.

create or replace function public.complete_task(
  p_aluno_id uuid,
  p_task_reward numeric
)
returns table(
  new_streak integer,
  bonus integer,
  reward integer,
  new_capicoins numeric,
  already_done boolean
)
language plpgsql
as $$
declare
  current_streak integer;
  last_date date;
  previous_coins numeric;
  next_streak integer;
  bonus_pct numeric;
begin
  select
    streak_atual,
    last_task_date,
    capicoins
  into current_streak, last_date, previous_coins
  from public.alunos
  where id = p_aluno_id;

  if not found then
    raise exception 'Aluno % não encontrado', p_aluno_id;
  end if;

  current_streak := coalesce(current_streak, 0);
  previous_coins := coalesce(previous_coins, 0);

  if last_date = current_date then
    new_streak := current_streak;
    reward := 0;
    bonus := 0;
    new_capicoins := previous_coins;
    already_done := true;
    return next;
  end if;

  if last_date = current_date - interval '1 day' then
    next_streak := current_streak + 1;
  else
    next_streak := 1;
  end if;

  bonus_pct := case
    when next_streak >= 7 then 0.50
    when next_streak >= 5 then 0.40
    when next_streak >= 4 then 0.30
    when next_streak >= 3 then 0.20
    when next_streak >= 2 then 0.10
    else 0
  end;

  bonus := round(p_task_reward * bonus_pct);
  reward := round(p_task_reward + bonus);
  new_capicoins := previous_coins + reward;

  update public.alunos
  set
    streak_atual = next_streak,
    last_task_date = current_date,
    capicoins = new_capicoins
  where id = p_aluno_id;

  new_streak := next_streak;
  already_done := false;
  return next;
end;
$$;

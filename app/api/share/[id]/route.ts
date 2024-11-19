//1
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import crypto from 'crypto';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shareToken = crypto.randomBytes(16).toString('hex');

  const { data, error } = await supabase
    .from('travel_plans')
    .update({ share_token: shareToken })
    .eq('id', params.id)
    .eq('email_id', user.email)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ share_token: shareToken });
}

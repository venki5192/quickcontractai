import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { analyzeContract } from '@/lib/analyzeContract';


export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user credits first
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', session.user.id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits <= 0) {
      return NextResponse.json({ 
        error: 'No credits remaining. Please upgrade to get more credits.',
      }, { status: 403 });
    }

    const formData = await request.formData();
    const content = formData.get('content') as string;
    const filename = formData.get('filename') as string;
    const model = formData.get('model') as string;

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    let analysis;
    try {
      // Attempt to analyze the contract
      analysis = await analyzeContract(content, model);
    } catch (error) {
      console.error('Analysis error:', error);
      return NextResponse.json({ 
        error: 'Failed to analyze contract. Please try again.' 
      }, { status: 500 });
    }

    // If analysis is successful, proceed with database operations
    try {
      // Start a Supabase transaction
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: session.user.id,
          filename: filename,
          status: 'completed',
          analysis_results: analysis.analysis,
          risk_level: analysis.riskLevel,
          score: analysis.score,
          model_used: model
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Only deduct credit after successful document creation
      const { error: creditError } = await supabase
        .from('users')
        .update({ credits: user.credits - 1 })
        .eq('id', session.user.id);

      if (creditError) throw creditError;

      return NextResponse.json({ 
        success: true, 
        documentId: document.id,
        remainingCredits: user.credits - 1
      });

    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        error: 'Failed to save analysis results' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Idea from '@/models/Idea';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const updatedIdea = await Idea.findByIdAndUpdate(
      params.id,
      { 
        $set: { 
          scheduledDate: body.scheduledDate,
          contentType: body.contentType,
          title: body.title,
          isDraft: body.isDraft
        } 
      },
      { new: true }
    );
    
    if (!updatedIdea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    return NextResponse.json(updatedIdea);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

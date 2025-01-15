import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // New way to handle dynamic routes
export const runtime = 'nodejs'; // Set the runtime environment

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers:', { svix_id, svix_timestamp, svix_signature });
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the raw body
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf).toString('utf-8');

  console.log('Received webhook payload:', body);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
    console.log('Webhook verified successfully:', evt);
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Process the event
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { email_addresses, image_url, first_name, last_name, username } = evt.data;

    if (!id) {
      return new Response('Missing user ID', { status: 400 });
    }

    const user = {
      clerkId: id,
      email: email_addresses[0]?.email_address ?? '',
      username: username ?? '',
      firstName: first_name ?? 'N/A',
      lastName: last_name ?? 'N/A',
      photo: image_url ?? '',
    };

    console.log('Creating user:', user);

    const newUser = await createUser(user);

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({ message: 'New user created', user: newUser });
  }

  if (eventType === 'user.updated') {
    const { image_url, first_name, last_name, username } = evt.data;

    if (!id) {
      return new Response('Missing user ID', { status: 400 });
    }

    const user = {
      firstName: first_name ?? 'N/A',
      lastName: last_name ?? 'N/A',
      username: username ?? '',
      photo: image_url ?? '',
    };

    console.log('Updating user:', user);

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: 'OK', user: updatedUser });
  }

  if (eventType === 'user.deleted') {
    if (!id) {
      return new Response('Missing user ID', { status: 400 });
    }

    console.log('Deleting user with ID:', id);

    const deletedUser = await deleteUser(id);

    return NextResponse.json({ message: 'OK', user: deletedUser });
  }

  return new Response('', { status: 200 });
}

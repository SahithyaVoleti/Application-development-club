'use client';
import { redirect } from 'next/navigation';

export default function DocumentationPageRedirect() {
  redirect('/resources/documentation/introduction');
}

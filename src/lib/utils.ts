/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function cleanAsterisks(text: string): string {
  if (!text) return '';
  return text
    // Replace bullet points starting with * into clean bullet points •
    .replace(/^(\s*)\*\s+/gm, '$1• ')
    // Remove bold/italic asterisks ***text***, **text**, *text*
    .replace(/\*{1,3}([^*]+?)\*{1,3}/g, '$1')
    // Remove any leftover stray asterisks
    .replace(/\*/g, '')
    .trim();
}

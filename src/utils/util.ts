import {TSeller, TShop} from '../types';
import uuid from 'react-native-uuid';

export const getInitials = (fullName: string) => {
  if (!fullName) return '';
  const nameParts = fullName.trim().split(' ');

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
};

export const getSellerName = (shop: TShop) => {
  if (!shop) return 'Seller';
  // sellerId may be populated object or just an id string
  if (typeof shop.sellerId === 'object' && shop.sellerId != null) {
    return (shop.sellerId as TSeller).sellerName ?? shop.sellerId ?? 'Seller';
  }
  return 'Seller';
};

const getFormattedAddress = (shop: TShop) => {
  // Prefer shop.address.formattedAddress; fall back to shop.address.completeAddress;
  // then fall back to populated seller address; last resort: 'N/A'
  if (shop?.address?.formattedAddress) return shop.address.formattedAddress;
  if (shop?.address?.completeAddress) return shop.address.completeAddress;

  return 'Address not available';
};

export const StringifyShort = (v: any) => {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')
    return String(v);
  try {
    const s = JSON.stringify(v);
    if (s.length > 50) return s.slice(0, 47) + '…';
    return s;
  } catch (e) {
    return String(v);
  }
};

export const formatAttrLabel = (k: string) => {
  return k
    .replace(/[_\-]/g, ' ')
    .replace(/\b\w/g, s => s.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
};

export const unwrapAttributeRaw = (raw: any) => {
  if (raw === null || raw === undefined) return raw;
  // If it's a Map (client could get Map() too)
  if (raw instanceof Map) {
    // try value key inside
    if (raw.has('value')) return raw.get('value');
    // fallback to plain object representation
    const obj: any = {};
    raw.forEach((v: any, k: any) => (obj[k] = v));
    if ('value' in obj) return obj.value;
    return obj;
  }

  // plain object with metadata e.g. { type, value, searchable, ... }
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    // Common pattern: { value: ... }
    if ('value' in raw) return raw.value;
    // Sometimes enums are { values: [...] }
    if ('values' in raw && Array.isArray(raw.values)) return raw.values;
    // if object looks like nested map/attrs, return as object to be handled later
    return raw;
  }

  // primitives and arrays
  return raw;
};

export const getAttributeEntries = (
  attrs: any,
): [string, {raw: any; value: any}][] => {
  if (!attrs) return [];

  // If Map
  if (attrs instanceof Map) {
    return Array.from(attrs.entries()).map(([k, raw]) => [
      String(k),
      {raw, value: unwrapAttributeRaw(raw)},
    ]);
  }

  // If plain object (typical from JSON over REST)
  if (typeof attrs === 'object' && !Array.isArray(attrs)) {
    return Object.entries(attrs)
      .filter(([k, v]) => v !== undefined && v !== null)
      .map(([k, raw]) => [String(k), {raw, value: unwrapAttributeRaw(raw)}]);
  }

  // If someone passed array of pairs [{ key, value }] or [{k,v}]
  if (Array.isArray(attrs)) {
    return attrs
      .map((a: any) => {
        if (!a) return null;
        if ('key' in a && 'value' in a)
          return [String(a.key), {raw: a, value: unwrapAttributeRaw(a.value)}];
        if (Array.isArray(a) && a.length >= 2)
          return [String(a[0]), {raw: a[1], value: unwrapAttributeRaw(a[1])}];
        return null;
      })
      .filter(Boolean) as [string, {raw: any; value: any}][];
  }

  return [];
};

export const hasAttributes = (attrs: any): boolean => {
  if (!attrs) return false;
  if (attrs instanceof Map) return attrs.size > 0;
  if (Array.isArray(attrs)) return attrs.length > 0;
  if (typeof attrs === 'object') return Object.keys(attrs).length > 0;
  return false;
};

export const generateUniqueId = (): string => {
  return uuid.v4();
};

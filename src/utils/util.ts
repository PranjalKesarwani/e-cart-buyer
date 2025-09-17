import {TSeller, TShop} from '../types';

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

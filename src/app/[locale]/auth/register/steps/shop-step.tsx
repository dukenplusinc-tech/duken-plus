'use client';

import { FC, Fragment, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCitiesOptionsSimple } from '@/lib/entities/cities/hooks/useCitiesOptionsSimple';

export interface ShopStepData {
  shopName: string;
  city: string;
  address: string;
}

interface ShopStepProps {
  data: ShopStepData;
  onChange: (data: Partial<ShopStepData>) => void;
  errors: Partial<Record<keyof ShopStepData, string>>;
}

export const ShopStep: FC<ShopStepProps> = ({ data, onChange, errors }) => {
  const t = useTranslations('register.shop');
  const cities = useCitiesOptionsSimple();

  // Find the selected city's ID based on the city name
  // If multiple cities have the same name, we'll use the first match
  const selectedCityId = useMemo(() => {
    if (!data.city) return undefined;
    // Search through all cities to find a match
    for (const { list } of cities) {
      const found = list.find((opt) => opt.value === data.city);
      if (found) return found.id;
    }
    return undefined;
  }, [data.city, cities]);

  // Create reverse lookup: ID -> city name
  const idToCityName = useMemo(() => {
    const map = new Map<string, string>();
    cities.forEach(({ list }) => {
      list.forEach((option) => {
        map.set(option.id, option.value);
      });
    });
    return map;
  }, [cities]);

  return (
    <div className="space-y-5">
      {/* Shop Name Field */}
      <div className="space-y-2">
        <Label htmlFor="shopName" className="text-sm font-medium">
          {t('form_label_shop_name')}
        </Label>
        <Input
          id="shopName"
          type="text"
          name="shopName"
          required
          placeholder={t('form_placeholder_shop_name')}
          value={data.shopName}
          onChange={(e) => onChange({ shopName: e.target.value })}
          className="h-11 text-base sm:h-10 sm:text-sm"
          autoComplete="organization"
          autoCapitalize="words"
          autoFocus
        />
        {errors.shopName && (
          <p className="text-xs text-destructive">{errors.shopName}</p>
        )}
      </div>

      {/* City Field */}
      <div className="space-y-2">
        <Label htmlFor="city" className="text-sm font-medium">
          {t('form_label_city')}
        </Label>
        <Select
          value={selectedCityId}
          onValueChange={(id) => {
            // Get city name from ID
            const cityName = idToCityName.get(id);
            if (cityName) {
              onChange({ city: cityName });
            }
          }}
          required
        >
          <SelectTrigger
            id="city"
            className="h-11 text-base sm:h-10 sm:text-sm"
          >
            <SelectValue placeholder={t('form_placeholder_city')} />
          </SelectTrigger>
          <SelectContent>
            {cities.map(({ group, list }, idx) => (
              <Fragment key={`group-${idx}-${group}`}>
                {/* Group Label */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {group}
                </div>
                {/* City Options */}
                {list.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    className="text-sm"
                  >
                    {option.label.length > 40
                      ? `${option.label.substring(0, 37)}...`
                      : option.label}
                  </SelectItem>
                ))}
              </Fragment>
            ))}
          </SelectContent>
        </Select>
        {errors.city && (
          <p className="text-xs text-destructive">{errors.city}</p>
        )}
      </div>

      {/* Address Field */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          {t('form_label_address')}
        </Label>
        <Input
          id="address"
          type="text"
          name="address"
          required
          placeholder={t('form_placeholder_address')}
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          className="h-11 text-base sm:h-10 sm:text-sm"
          autoComplete="street-address"
          autoCapitalize="words"
        />
        {errors.address && (
          <p className="text-xs text-destructive">{errors.address}</p>
        )}
      </div>
    </div>
  );
};

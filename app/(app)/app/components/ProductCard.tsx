"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image'
import NutrientBundle from './NutrientBundle';
import { ProductNutrients, Products } from '@prisma/client';
import { getProductNutrients } from '@/(app)/actions';

export default function ProductCard( {product, withNutrients = false}: {product: Products, withNutrients?: boolean} ) {

  const [negativeNutrients, setnegativeNutrients] = useState<ProductNutrients[] | null>(null);
  const [positiveNutrients, setpositiveNutrients] = useState<ProductNutrients[] | null>(null);
  const [nutrients, setNutrients] = useState<ProductNutrients[] | null>(null);

  useEffect(() => {
    (async () => {
      if ( !product || !withNutrients || nutrients ) return;

      setNutrients( await getProductNutrients( product.id ) );
    })();
  }, []);


  useEffect(() => {
    if ( !nutrients ) return;
    if ( negativeNutrients !== null || positiveNutrients !== null ) return;

    // 3. Separate negatives and positives (positive to negative => 0, 1, 2, 3)
    setnegativeNutrients( nutrients.filter((nutrient) => nutrient.rated && nutrient.rated >= 2) );
    setpositiveNutrients( nutrients.filter((nutrient) => nutrient.rated && nutrient.rated < 2) );
  }, [nutrients]);


  return (
    <>
      <div className="flex gap-4">
        <Image src={product.image || `/no-image.webp`} alt={product.name} className='w-1/3 object-cover aspect-square rounded-xl' width="100" height="100" />
        <div className='flex-1'>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-400 font-light text-sm pb-2">{product.brandName ? product.brandName : product.brandOwner}</p>
          {/* <p className='pt-2 font-light text-sm'><b>Ingredients:</b> {product.ingredients}</p> */}
          {product.servingSize &&
            <p className='pt-1 font-light text-sm'><b>Serving Size:</b> {product.servingSize}{product.servingUnit}</p>}
          <p className='pt-2 text-xs italic text-text-800 line-clamp-3 lowercase'>{product.ingredients}</p>
        </div>
      </div>
      {withNutrients && nutrients && (
        <>
          {negativeNutrients && <NutrientBundle title='Negatives' nutrients={negativeNutrients} />}
          {positiveNutrients && <NutrientBundle title='Positives' nutrients={positiveNutrients} />}
        </>
      )}
    </>
  )
}
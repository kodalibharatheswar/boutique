// Import all category images
import sareesImg from '@/assets/static/images/shopcategory/sarees.png'
import lehengasImg from '@/assets/static/images/shopcategory/lehengas.png'
import kurthiImg from '@/assets/static/images/shopcategory/kurthi&suits.png'
import longfrockImg from '@/assets/static/images/shopcategory/longfrock.png'
import momMeImg from '@/assets/static/images/shopcategory/Mom-Me.png'
import dupattaImg from '@/assets/static/images/shopcategory/Dupatta.png'
import kidswearImg from '@/assets/static/images/shopcategory/kidswear.png'
import blousesImg from '@/assets/static/images/shopcategory/Blouses.png'
import readymateImg from '@/assets/static/images/shopcategory/readymate.png'
import logo from '@/assets/static/images/Chaknik_Logo.png'

export const categoryImages = {
  'Sarees': sareesImg,
  'Lehengas': lehengasImg,
  'Kurtis': kurthiImg,
  'Long Frocks': longfrockImg,
  'Mom & Me': momMeImg,
  'Dupattas': dupattaImg,
  'Kids wear': kidswearImg,
  'Blouses': blousesImg,
  'Ready To Wear': readymateImg,
}

export const brandLogo = logo

// Product images (dynamically loaded from API)
export const getProductImage = (imageUrl) => {
  // If image URL is absolute (http://...), return as-is
  if (imageUrl && imageUrl.startsWith('http')) {
    return imageUrl
  }
  
  // If relative path from backend, prepend backend URL
  return `http://localhost:8080${imageUrl}`
}
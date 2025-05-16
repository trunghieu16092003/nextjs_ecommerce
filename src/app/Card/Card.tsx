'use client'

import React, {useState} from 'react'
import './card.css'
import custom from './custom.module.css'
import clsx from 'clsx'

const Card = () => {
    const [expanded, setExpanded] = useState(true)
  return (
    <div className={clsx('card', {
        [custom.card]: expanded,
       
    })} 
  >
      Card
    </div>
  )
}

export default Card

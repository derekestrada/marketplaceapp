import React, { useEffect } from 'react'
import { useState } from 'react'

function BagItem({bag, id}) {
    const [showFish, setShowFish] = useState(false)
    const [bagWeight, setBagWeight] = useState(null)

    useEffect(() => {
        let bagTotal = 0
        let bagLength = ''
        bag.fish.length > 5 ? bagLength = 5 : bagLength = bag.fish.length
        
        const bagTotals = bag.fish
        bagTotals.sort((a,b)=>b-a);
    
        for (let i=0; i < bagLength; i++) {
            bagTotal += bagTotals[i]
        }

        const roundedBag = bagTotal.toFixed(2);
        setBagWeight(roundedBag)
        // eslint-disable-next-line 
    }, [])



    const handleClick = (e) => {
        console.log('click', e.target.value)
        e.target.value === 'true' ? setShowFish(false) : setShowFish(true)
        console.log(showFish)
    }
    return (
        <li className="bagItem" key={id}>
            <div className="flex bagItemHeader">
                <h4>{bag.lake}</h4>
                <h5>{bag.date}</h5>
            </div>
            <div className="flex bagItemInfo">
                <div>
                    <h6>Total Weight</h6>
                    <p>{bagWeight}lbs</p>
                </div>
                <div>
                    <h6>Big Bass</h6>
                    <p>{Math.max(...bag.fish)}lbs</p>
                </div>
                <div>
                    <h6>Total Fish</h6>
                    <p>{bag.fish.length}</p>
                </div>
            </div> 
            <div className="fishList">
                <button value={showFish} onClick={handleClick}>See List Of Fish</button>
                {showFish && (
                    <ul>
                        {bag.fish.map((fish, key) => (
                            <li key={key}><span>{bag.species[key]}</span><span>{fish}</span></li>
                        ))}
                    </ul>
                )}
            </div>
        </li>     
      )
}

export default BagItem
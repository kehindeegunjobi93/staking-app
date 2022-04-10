import React from 'react'

const Navbar = ({ account }) => {
  return (
    <div className='navbar navbar-dark fixed-top shadow p-0' style={{backgroundColor:'black', height:'50px'}}>
          <a className='navbar-brand col-sm-3 col-md-2 mr-0' 
                style={{color:'white'}}>DAPP Yield Staking (Decentralized Banking)
                </a>
                <ul className='navbar-nav px-3'>
                    <li className='text-nowrap d-none nav-item d-sm-none d-sm-block'>
                        <small style={{color:'white'}}>ACCOUNT NUMBER: {account}
                        </small>
                    </li>
                </ul>
        </div>
  )
}

export default Navbar
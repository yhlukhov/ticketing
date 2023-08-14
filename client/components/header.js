import Link from 'next/link'

const Header = ({currentUser}) => {
  const links = [
    !currentUser && {label: 'Sign Up', href: '/auth/signup'},
    !currentUser && {label: 'Sign In', href: '/auth/signin'},
    currentUser && {label: 'Create ticket', href: '/tickets/create'},
    currentUser && {label: 'My Orders', href: '/orders'},
    currentUser && {label: 'Sign Out', href: '/auth/signout'},
  ]
  .filter(isLink => isLink)

  return <nav className="navbar navbar-light bg-light">
    <div className="container-fluid">
      <Link href="/" className='navbar-brand'>GitTix</Link>
      <span>{currentUser ? currentUser.email : 'You are signed out'}</span>
      <div className="d-flex justify-content-end">
        <ul className='nav d-flex align-items-center'>
          {links.map(({label, href}) => <li className='nav-item' key={href}>
            <Link href={href} className='nav-link'>{label}</Link>
          </li>
          )}
        </ul>
      </div>
    </div>
  </nav>
}

export default Header
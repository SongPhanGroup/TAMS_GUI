// ** Logo
import logo from '@src/assets/images/hvlq/logo_hvlq_1280X1280.PNG'

const SpinnerComponent = () => {
  return (
    <div className='fallback-spinner app-loader'>
      {/* <img className='fallback-logo' src={logo} alt='logo' /> */}
      <div className='loading'>
        <div className='effect-1 effects'></div>
        <div className='effect-2 effects'></div>
        <div className='effect-3 effects'></div>
      </div>
    </div>
  )
}

export default SpinnerComponent

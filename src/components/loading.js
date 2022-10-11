import spinner from '../assets/spinner.gif'

export default function LoadingSpinner() {
    return (
    <div className="content">
        <h3>'Loading...'</h3>
        <img src={spinner} alt='nah'/>
    </div>
    )
}
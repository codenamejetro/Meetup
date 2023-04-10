import { NavLink } from "react-router-dom"

function SplashOptionsDisplay({ imgUrl, text, smallerText, redirectUrl }) {
    return (
        <>
        <div className="splash-options-display-image style-all-three">
            <img src={`${imgUrl}`} />
        </div>
        <NavLink className="splash-options-display-text style-all-three" to={`${redirectUrl}`}>{text}</NavLink>
        <div className="splash-options-display-smaller-text style-all-three">
            {smallerText}
        </div>
        </>
    )
}

export default SplashOptionsDisplay

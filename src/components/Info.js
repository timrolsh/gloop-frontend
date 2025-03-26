
import info_url from "../assets/img/info.svg";

export default function Info(props) {
    return (
        <span className='info' data-title={props.content}>
            <img src={info_url} width={14} />
        </span>
    )
}
import moment from "moment";

type Props = {
    readonly date: string | number,
    readonly format?: string
    readonly variant?: "date" | "from-now" | "yyyy-mm-dd"
}

export default function BMoment(props: Props) {

    const { format, variant } = props;

    let { date } = props;
    if (typeof date == 'number')
        date = (new Date()).setTime(date);

    switch (variant) {
        case 'from-now':
            let label = moment(date).fromNow();
            label = label.split('minutes').join('mins');
            label = label.split('seconds').join('secs');

            label = label.split(' ').join('&nbsp;');
            label = label.split('&nbsp;ago').join(' ago');

            return <span dangerouslySetInnerHTML={{ __html: label }} />

        case "yyyy-mm-dd":
            return (<>{moment(date).format(format || "YYYY-MM-DD")}</>)

        default:
            return (<>{moment(date).format(format || "D MMMM YYYY")}</>)

    }
}
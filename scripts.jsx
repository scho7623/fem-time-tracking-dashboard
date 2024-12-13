const App = () => {
  const [ data, setData ] = React.useState();
  const [ filter, setFilter ] = React.useState('daily');

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('./data.json');
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);

  const processedData = React.useMemo(() => {
    if (!data) return [];
    return data.map((record) => ({
      title: record.title,
      timeframe: {
        ...(record.timeframes[filter]),
      },
    }));
  }, [data, filter]);

  const prevLabel = React.useMemo(() => {
    if (filter === 'daily') {
      return 'Yesterday';
    } else if (filter === 'weekly') {
      return 'Last Week';
    }
    return 'Last Month';
  }, [filter]);

  const filterHandler = React.useCallback((e) => {
    setFilter(e.target.textContent.toLowerCase());
  }, []);

  return (
    <div className="container">
      <section className="card">
        <div className="profile">
          <div className="avatar">
            <img src="./images/image-jeremy.png" alt="Avatar" />
          </div>
          <div className="report">
            <div className="label">Report for</div>
            <div className="name">Jeremy<br />Robson</div>
          </div>
        </div>
        <ul className="filter">
          <li>
            <button onClick={filterHandler} className={filter === 'daily' && 'active'}>Daily</button>
          </li>
          <li>
            <button onClick={filterHandler} className={filter === 'weekly' && 'active'}>Weekly</button>
          </li>
          <li>
            <button onClick={filterHandler} className={filter === 'monthly' && 'active'}>Monthly</button>
          </li>
        </ul>
      </section>
      <>
        {
          processedData && processedData.map((record) => 
            <Record key={record.title}
              title={record.title}
              timeframe={record.timeframe}
              prevLabel={prevLabel} />
          )
        }
      </>
    </div>
  );
};

const bannerImg = {
  work: './images/icon-work.svg',
  play: './images/icon-play.svg',
  study: './images/icon-study.svg',
  exercise: './images/icon-exercise.svg',
  social: './images/icon-social.svg',
  'self-care': './images/icon-self-care.svg',
};

const Record = ({ title, timeframe, prevLabel }) => {
  const titleStr = title.split(' ').join('-').toLowerCase();
  return (
    <section className={`card ${titleStr}`}>
      <img src={bannerImg[titleStr]} alt="" />
      <div className="record">
        <header>
          <h2>{title}</h2>
          <div className="menu-image">
            <img src="./images/icon-ellipsis.svg" alt="menu" />
          </div>
        </header>
        <div className="timeframe">
          <div className="current">{timeframe.current}hrs</div>
          <div className="previous">{`${prevLabel} - ${timeframe.previous}hrs`}</div>
        </div>
      </div>
    </section>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row text-body-secondary">
          <div className="col-6 text-start">
            <a href="https://github.com/Shetty073" className="text-body-secondary">
              <strong>Ashish Shetty</strong>
            </a>
          </div>
          <div className="col-6 text-end text-body-secondary d-none d-md-block">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-body-secondary">
                  About
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#" className="text-body-secondary">
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
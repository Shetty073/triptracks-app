import { Link } from "react-router";
import Footer from "../components/footer.component";

export default function HomePage() {
  return (
    <>
      <header className="p-3 text-bg-dark">
        <nav className="navbar  navbar-expand-lg bg-body-tertiary bg-dark border-bottom border-body" data-bs-theme="dark">
          <div className="container-fluid">

            <a className="navbar-brand" href="#">Triptracks</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">

              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="#">Link</a>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                  </a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </li>

                <li className="nav-item">
                  <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                </li>

              </ul>

              <form className="d-flex" role="search">
                <input className="form-control me-4" type="search" placeholder="Search" aria-label="Search" />
              </form>

              <hr className="featurette-divider" />

              <div className="text-end">
                <Link to="/auth" className="btn btn-outline-light me-2">Login</Link>
                <button type="button" className="btn btn-warning">Sign-up</button>
              </div>

            </div>

          </div>

        </nav>
      </header>

      <main>
        <div id="myCarousel" className="carousel slide mb-6 pointer-event" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2" className="active" aria-current="true"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item">
              <svg className="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><rect width="100%" height="100%" fill="var(--bs-secondary-color)"></rect></svg>
              <div className="container">
                <div className="carousel-caption text-start">
                  <h1>Example headline.</h1>
                  <p className="opacity-75">Some representative placeholder content for the first slide of the carousel.</p>
                  <p><a className="btn btn-lg btn-primary" href="#">Sign up today</a></p>
                </div>
              </div>
            </div>
            <div className="carousel-item active">
              <svg className="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><rect width="100%" height="100%" fill="var(--bs-secondary-color)"></rect></svg>
              <div className="container">
                <div className="carousel-caption">
                  <h1>Another example headline.</h1>
                  <p>Some representative placeholder content for the second slide of the carousel.</p>
                  <p><a className="btn btn-lg btn-primary" href="#">Learn more</a></p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <svg className="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><rect width="100%" height="100%" fill="var(--bs-secondary-color)"></rect></svg>
              <div className="container">
                <div className="carousel-caption text-end">
                  <h1>One more for good measure.</h1>
                  <p>Some representative placeholder content for the third slide of this carousel.</p>
                  <p><a className="btn btn-lg btn-primary" href="#">Browse gallery</a></p>
                </div>
              </div>
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>

          <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* <!-- Wrap the rest of the page in another container to center all the content. --> */}

        <div className="container marketing py-5">
          {/* <!-- Three columns of text below the carousel --> */}
          <div className="row">

            <div className="col-lg-4">
              <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice"><title>Placeholder</title><rect width="100%" height="100%" fill="var(--bs-secondary-color)"></rect></svg>
              <h2 className="fw-normal">Heading</h2>
              <p>Some representative placeholder content for the three columns of text below the carousel. This is the first column.</p>
              <p><a className="btn btn-secondary" href="#">View details »</a></p>
            </div>

            <div className="col-lg-4">
              <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice"><title>Placeholder</title><rect width="100%" height="100%" fill="var(--bs-secondary-color)"></rect></svg>
              <h2 className="fw-normal">Heading</h2>
              <p>Another exciting bit of representative placeholder content. This time, we've moved on to the second column.</p>
              <p><a className="btn btn-secondary" href="#">View details »</a></p>
            </div>

            <div className="col-lg-4">
              <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice"><title>Placeholder</title><rect width="100%" height="100%" fill="var(--bs-secondary-color)"></rect></svg>
              <h2 className="fw-normal">Heading</h2>
              <p>And lastly this, the third column of representative placeholder content.</p>
              <p><a className="btn btn-secondary" href="#">View details »</a></p>
            </div>

          </div>


          {/* <!-- START THE FEATURETTES --> */}

          <hr className="featurette-divider" />

          <div className="row featurette py-5">
            <div className="col-md-7">
              <h2 className="featurette-heading fw-normal lh-1">First featurette heading. <span className="text-body-secondary">It’ll blow your mind.</span></h2>
              <p className="lead">Some great placeholder content for the first featurette here. Imagine some exciting prose here.</p>
            </div>

            <div className="col-md-5">
              <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice"><title>Placeholder</title><rect width="100%" height="100%" fill="var(--bs-secondary-bg)"></rect><text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">500x500</text></svg>
            </div>

          </div>

          <hr className="featurette-divider" />

          <div className="row featurette py-5">
            <div className="col-md-7 order-md-2">
              <h2 className="featurette-heading fw-normal lh-1">Oh yeah, it’s that good. <span className="text-body-secondary">See for yourself.</span></h2>
              <p className="lead">Another featurette? Of course. More placeholder content here to give you an idea of how this layout would work with some actual real-world content in place.</p>
            </div>

            <div className="col-md-5 order-md-1">
              <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice"><title>Placeholder</title><rect width="100%" height="100%" fill="var(--bs-secondary-bg)"></rect><text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">500x500</text></svg>
            </div>

          </div>

          <hr className="featurette-divider" />

          <div className="row featurette py-5">
            <div className="col-md-7">
              <h2 className="featurette-heading fw-normal lh-1">And lastly, this one. <span className="text-body-secondary">Checkmate.</span></h2>
              <p className="lead">And yes, this is the last block of representative placeholder content. Again, not really intended to be actually read, simply here to give you a better view of what this would look like with some actual content. Your content.</p>
            </div>

            <div className="col-md-5">
              <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice"><title>Placeholder</title><rect width="100%" height="100%" fill="var(--bs-secondary-bg)"></rect><text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">500x500</text></svg>
            </div>

          </div>

          <hr className="featurette-divider" />

        </div>
        
      </main>
      
      <Footer />
    </>
  );
}
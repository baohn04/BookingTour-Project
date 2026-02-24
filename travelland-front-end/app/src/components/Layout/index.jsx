import Header from "./Header"
import Footer from "./Footer"
import Main from "./Main"
import FloatingActions from "../FloatingActions"

function LayoutDefault() {
  return (
    <>
      <div className="layout-default relative">
        <Header />
        <Main />
        <Footer />
        <FloatingActions />
      </div>
    </>
  )
}

export default LayoutDefault
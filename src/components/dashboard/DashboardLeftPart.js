import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import {routes} from "../../consts/routes";

export default function DashboardLeftPart() {
  return (
    <div className="radius-8 bg-trans px-4 pt-4 pb-4 min-h-357 mb-3">
      <div className="d-flex v-center space-between">
        <div className="font-18 bold-600 color-white">My Dashboard</div>
        <div className="font-14 bold-700 color-white bg-trans radius-8 py-2 px-3 border-1 border-green mobile-show">
          100% APR
        </div>
      </div>
      <div>
        <hr className="hr-3 border-dark-green" />
      </div>
      <div className="d-flex v-center space-between">
        <div>
          <div className="font-16 bold-300 color-gray my-3">
            <span className="mr-10">GMI Points</span>
          </div>
          <div className="font-16 bold-300 color-gray my-3">
            <span className="mr-10">Users Referred</span>
          </div>
          <div className="font-16 bold-300 color-gray my-3">
            <span className="mr-10">Referral Boost</span>
          </div>
          <div className="font-16 bold-300 color-gray my-3">
            <span className="mr-10">Total Points</span>
          </div>
          <div className="font-16 bold-300 color-gray my-3">
            <span className="mr-10">Leaderboard Rank</span>
          </div>
        </div>
        <div>
          <div className="font-16 bold-700 color-white my-3 text-end">22,000</div>
          <div className="font-16 bold-700 color-white my-3 text-end">20</div>
          <div className="font-16 bold-700 color-white my-3 text-end">2,000</div>
          <div className="font-16 bold-700 color-white my-3 text-end">22,000</div>
          <div className="font-16 bold-700 color-white my-3 text-end">#1</div>
        </div>
      </div>
      <div className="desktop-flex space-between">
        <div className="width-100 p-1">
          <Link to={routes.Gmi.path}>
            <Button className="gloop-btn-second font-16 bold-700 radius-8 bg-white border-white color-dark p-10-25 my-1 w-100">
              Buy GMI
            </Button>
          </Link>
        </div>
        <div className="width-100 p-1">
          <Link to={routes.Leaderboard.path}>
            <Button className="gloop-btn-second font-16 bold-700 radius-8 bg-trans-0 border-white color-white p-10 my-1 w-100 ">
              Visit Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

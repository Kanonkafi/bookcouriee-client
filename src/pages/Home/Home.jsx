import Banner from "../../components/Banner";
import LatestBooks from "../../components/LatestBooks";
import Coverage from "../../components/Coverage";
import WhyUs from "../../components/WhyUs";

const Home = () => {
  return (
    <div>
      {/* Hero Banner */}
      <Banner/>

      {/* Latest Books */}
      <LatestBooks/>

      {/* Why Us */}
      <WhyUs/>

      {/* Coverage Map */}
      <Coverage/>

    </div>
  );
};

export default Home;


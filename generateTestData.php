<?php
/**
 * Created by IntelliJ IDEA.
 * User: yousan
 * Date: 8/8/15
 * Time: 6:43 PM
 */

$generateTestData = new generateTestData();
$generateTestData->generate();

class GenerateTestData {

    const NW_LATITUDE = 37.5264602; // north west 北西
    const NW_LONGITUDE = 139.8918034; // north west 北西

    const SE_LATITUDE = 37.4832233; // north west 南東
    const SE_LONGITUDE = 139.9542452; // north west 南東

    const MAX_POINT = 500;

    const Dividing = 5;

    /** @var Geopoint[] */
    private $juus = array();

    /** @var  Geopoint */
    private $NW_point;

    /** @var  Geopoint */
    private $SE_point;


    private function getWidth() {
        return self::NW_LONGITUDE - self::SE_LONGITUDE;
    }

    private function getHeight() {
        return self::NW_LATITUDE - self::SE_LATITUDE;
    }

    public function __construct() {
        $this->NW_point = new Geopoint(self::NW_LONGITUDE, self::NW_LATITUDE);
        $this->SE_point = new Geopoint(self::SE_LONGITUDE, self::SE_LATITUDE);
        $this->generate5x5Juu();
        ///var_dump($this->juus);exit;
    }

    public function generate() {
        $rets = array();
        for($i=0; $i<self::MAX_POINT; $i++) {
            $sasukeneRow = new SasukeneRow();
            $sasukeneRow->status = 0;
            $sasukeneRow->type = 1;
            $latitude = rand(0, self::Dividing-1);
            $longitutude = rand(0, self::Dividing-1);
            $point = $this->juus[$latitude][$longitutude];
            $sasukeneRow->geo = $point;
            $rets['results'][] = $sasukeneRow;
            unset($sasukeneRow);
        }
        echo json_encode($rets);
    }


    /**
     * 縦横5x5分割したポイントを作成する その箱のことを什
     */
    private function generate5x5Juu() {
        $juuWidth  = $this->getWidth()  / self::Dividing;
        $juuHeight = $this->getHeight() / self::Dividing;
        for ($i=0; $i<self::Dividing; $i++) {
            for ($j=0 ;$j<self::Dividing; $j++) {
                $longitude = $this->NW_point->longitude + $juuWidth * ($i + 0.5);
                $latitude  = $this->NW_point->latitude + $juuHeight * ($j + 0.5);
                $point = new GeoPoint($longitude, $latitude);
                $this->juus[$j][$i] = $point;
            }
        }
    }
}

class SasukeneRow {
    public $geo;
    public $type;
    public $status;
}


class GeoPoint {
    public $__type = 'GeoPoint';
    public $longitude; // 経度
    public $latitude; // 緯度 139


    public function __construct($longitude, $latitude) {
        $this->longitude = $longitude;
        $this->latitude = $latitude;
    }
}
<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Forecast_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function get($id_city = null)
    {
        if (!is_null($id_city)) {
            $query = $this->db->select('*')->from('forecast')->where('id_city', $id_city)->order_by('date', 'ASC')->get();
            if ($query->num_rows() > 0) {
                return $query->result_array();
            }

            return null;
        }

        $query = $this->db->select('*')->from('forecast')->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        }

        return null;
    }

    public function save($forecast)
    {
        $this->db->set($this->_setForecast($forecast))->insert('forecast');

        if ($this->db->affected_rows() === 1) {
            return $this->db->insert_id();
        }

        return null;
    }

    public function update($id, $forecast)
    {
        $this->db->set($this->_setForecast($forecast))->where('id', $id)->update('forecast');

        if ($this->db->affected_rows() === 1) {
            return true;
        }

        return null;
    }

    public function delete($id)
    {
        $this->db->where('id', $id)->delete('forecast');

        if ($this->db->affected_rows() === 1) {
            return true;
        }

        return false;
    }

    private function _setForecast($forecast)
    {
        return array(
            'forecast'    => $forecast['forecast'],
            'date'        => $forecast['date'],
            'id_city'     => $forecast['id_city']
        );
    }
}
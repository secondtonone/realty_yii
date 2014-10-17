<?php
class EventJournaling
{
	public $date;
	
	public function __construct()
	{
		$this->date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
	}
	public function userEntering($id_user)
    {
		$journal = new Journal;
		$journal->id_user=$id_user;
		$journal->id_type_event=1;
		$journal->time_event=$this->date;
		$journal->save();
	}
	public function userExiting($id_user)
    {
		$journal = new Journal;
		$journal->id_user=$id_user;
		$journal->id_type_event=2;
		$journal->time_event=$this->date;
		$journal->save();
	}
	public function userSellsObject($id_user)
    {
		$journal = new Journal;
		$journal->id_user=$id_user;
		$journal->id_type_event=3;
		$journal->time_event=$this->date;
		$journal->save();
	}
	public function userLastActivity($id_user)
    {
		$journal = new Journal;
		$journal->id_user=$id_user;
		$journal->id_type_event=4;
		$journal->time_event=$this->date;
		$journal->save();
	}
	public function userAddObject($id_user)
    {
		$journal = new Journal;
		$journal->id_user=$id_user;
		$journal->id_type_event=5;
		$journal->time_event=$this->date;
		$journal->save();
	}
	public function userAddClient($id_user)
    {
		$journal = new Journal;
		$journal->id_user=$id_user;
		$journal->id_type_event=6;
		$journal->time_event=$this->date;
		$journal->save();
	}
	public function userAddUser($id_user)
    {
		$journal = new Journal;
		$journal->id_user=$id_user;
		$journal->id_type_event=7;
		$journal->time_event=$this->date;
		$journal->save();
	}
}
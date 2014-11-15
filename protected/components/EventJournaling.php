<?php
class EventJournaling extends ModifyComponent
{
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
	public function userLastActivity($id_user,$time_activity)
    {
		$journal = new Journal;
		$journal->id_user=$id_user;
		$journal->id_type_event=4;
		$journal->time_event=$time_activity;
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
	public function userDataExport($id_user)
    {
		$journal = new Journal;
		$journal->id_user=$id_user;
		$journal->id_type_event=8;
		$journal->time_event=$this->date;
		$journal->save();
	}
}